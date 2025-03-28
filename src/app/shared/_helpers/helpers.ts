import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { TokenStorageService } from "../_service/token-storage.service";


const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private token: TokenStorageService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = '!!@@##ten@9234434490!!@@##';
        if (token) {

            const authReq = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + token)
            });
            return next.handle(authReq);
        }
        else {
            return next.handle(req);
        }

    }

}

export const authInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
