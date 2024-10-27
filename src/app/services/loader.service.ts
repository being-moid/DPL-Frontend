import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _loading = new BehaviorSubject<boolean>(false);
  private _loadingMessage = new BehaviorSubject<string | null>(null);
  private _messageQueue: { type: 'success' | 'error', text: string, timeout: number }[] = [];
  private _message = new BehaviorSubject<{ type: string, text: string } | null>(null);
  private messageTimeoutId: any;

  loading$ = this._loading.asObservable();
  loadingMessage$ = this._loadingMessage.asObservable();
  message$ = this._message.asObservable();

  show(message: string = 'Loading...') {
    this._loading.next(true);
    this._loadingMessage.next(message);
  }

  hide() {
    this._loading.next(false);
    this._loadingMessage.next(null);
  }

  showMessage(type: 'success' | 'error', text: string, timeout: number =500) {
    this._messageQueue.push({ type, text, timeout });
    this.processMessageQueue();
  }

  private processMessageQueue() {
    // If there's already a message being displayed, do nothing
    if (this._message.value) {
      return;
    }

    // If there are no messages in the queue, do nothing
    if (this._messageQueue.length === 0) {
      return;
    }

    // Show the next message
    const { type, text, timeout } = this._messageQueue.shift()!;
    this._message.next({ type, text });

    // Clear the message after the specified timeout
    this.messageTimeoutId = setTimeout(() => {
      this._message.next(null);
      this.processMessageQueue(); // Process the next message in the queue
    }, timeout);
  }

  clearMessages() {
    clearTimeout(this.messageTimeoutId);
    this._messageQueue = [];
    this._message.next(null);
  }
}
