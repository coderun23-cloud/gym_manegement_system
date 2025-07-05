<?php

namespace App\Http\Controllers;

use Log;
use Exception;
use App\Models\Plan;
use App\Models\Payment;
use App\Models\MemberShip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    public function index()
    {
        return Payment::with('user')->latest()->paginate(10);
    }

public function store(Request $request)
{
    try {
        $request->validate([
            'user_id'    => 'required|exists:users,id',
            'plan_id'    => 'required|exists:plans,id',
            'email'      => 'required|email',
            'phone'      => 'required|string',
            'first_name' => 'required|string',
            'last_name'  => 'required|string',
        ]);

        $plan = Plan::findOrFail($request->plan_id);

        $membership = MemberShip::create([
            'user_id'    => $request->user_id,
            'plan_id'    => $plan->id,
            'start_date' => now(),
            'end_date'   => now()->addDays($plan->duration_days),
            'status'     => 'pending'
        ]);

        $tx_ref = 'GYM_' . uniqid();

        $payment = Payment::create([
            'user_id'     => $request->user_id,
            'first_name'  => $request->first_name,
            'last_name'   => $request->last_name,
            'email'       => $request->email,
            'phone'       => $request->phone,
            'amount'      => $plan->price,
            'tx_ref'      => $tx_ref,
            'status'      => 'pending',
            'payment_for' => 'membership',
            'reference_id'=> $membership->id
        ]);

        $response = Http::withToken(env('CHAPA_SECRET_KEY'))->post('https://api.chapa.co/v1/transaction/initialize', [
            'amount'       => $payment->amount,
            'email'        => $payment->email,
            'first_name'   => $payment->first_name,
            'last_name'    => $payment->last_name,
            'phone'        => $payment->phone,
            'tx_ref'       => $payment->tx_ref,
            'callback_url' => route('payment.callback'),
            'return_url'   => 'https://example.com/success',
            'currency'     => 'ETB',
        ]);

        $body = $response->json();

        if (!isset($body['status']) || $body['status'] !== 'success') {
            \Log::error('Chapa payment initialization failed', ['response' => $body]);
            return response()->json([
                'message' => 'Chapa initialization failed.',
                'error'   => $body
            ], 500);
        }

        return response()->json([
            'message'      => 'Chapa payment started.',
            'checkout_url' => $body['data']['checkout_url'],
        ]);

    } catch (Exception $e) {
        Log::error('Payment Store Error: ' . $e->getMessage(), [
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'message' => 'An unexpected error occurred.',
            'error'   => $e->getMessage()
        ], 500);
    }
}



   
public function callback(Request $request)
{
    try {
        $tx_ref = $request->input('tx_ref');

        if (!$tx_ref) {
            return response()->json(['message' => 'Transaction reference is missing'], 400);
        }

        $payment = Payment::where('tx_ref', $tx_ref)->first();

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $verify = Http::withToken(env('CHAPA_SECRET_KEY'))
                      ->get("https://api.chapa.co/v1/transaction/verify/{$tx_ref}");

        $result = $verify->json();

        Log::info('Chapa verify response', $result);

        if (isset($result['status']) && $result['status'] === 'success') {
            $payment->update(['status' => 'success']);

            return response()->json([
                'message' => 'Payment successful',
                'status' => 'success'
            ]);
        }

        $payment->update(['status' => 'failed']);

        return response()->json([
            'message' => 'Payment failed',
            'status' => 'failed',
            'details' => $result 
        ]);
    } catch (\Exception $e) {
        Log::error('Callback error: ' . $e->getMessage());

        return response()->json([
            'message' => 'Server error during callback',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
