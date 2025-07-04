<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone');
            $table->decimal('amount', 10, 2);
            $table->string('tx_ref')->unique();
            $table->enum('status', ['pending', 'success', 'failed'])->default('pending');
            $table->string('payment_for')->nullable(); // e.g., 'membership'
            $table->unsignedBigInteger('reference_id')->nullable(); // e.g., membership_id
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
