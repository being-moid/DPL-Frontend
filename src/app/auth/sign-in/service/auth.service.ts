import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment, APIEndpoints } from "../../../enviornment/enviornment.development";
import { map, Observable, Subject, catchError, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export default class AuthService {

  private $sub: Subject<any> = new Subject<any>();
  $authObs: Observable<any> = this.$sub.asObservable();
  baseUrl: string;
  Authorized: Subject<{ token: string }> = new Subject<{ token: string }>();

  constructor(private client: HttpClient) {
    this.baseUrl = environment.BASE_URL + APIEndpoints.Auth;
  }

  getAuth(email: string, password: string): Observable<string | undefined> {
    const url = `${this.baseUrl}`; // Append /login to the base URL if it's not already included
    const headers = { 'Content-Type': 'application/json', 'accept': '*/*' }; // Set the headers

    return this.client.post<HttpResponse<any>>(
      url,
      { email, password }, // Pass the email and password as the request body
      { headers, observe: 'response' }
    ).pipe(
      map((res: HttpResponse<any>) => {
        if (res.ok && res.body?.token) {
          const { token } = res.body;
          this.Authorized.next({ token });
          this.$sub.next({ isAuthenticated: true });
          return token;
        } else {
          this.Authorized.error('Authentication failed');
          this.$sub.next({ isAuthenticated: false });
          return undefined;
        }
      }),
      catchError((error) => {
        this.Authorized.error('Authentication failed');
        this.$sub.next({ isAuthenticated: false });
        return of(undefined);
      })
    );
  }


  isAuthenticated(): Observable<boolean> {
    return this.$authObs.pipe(map(auth => auth?.isAuthenticated || false));
  }
}
