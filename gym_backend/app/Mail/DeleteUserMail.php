<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Reason;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;

class DeleteUserMail extends Mailable
{
    use Queueable, SerializesModels;

       public $user;
       public $reason;

    public function __construct(User $user,Reason $reason)
    {
        $this->user = $user;
        $this->reason = $reason;

    }

    public function build()
    {
        return $this->subject('About You Account')
                    ->view('emails.deleteAccount');
    }
}
