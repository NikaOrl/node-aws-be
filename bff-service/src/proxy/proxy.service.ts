import { Injectable, HttpService, HttpException } from "@nestjs/common";
import { map, catchError } from "rxjs/operators";
import { AxiosRequestConfig, Method } from "axios";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class ProxyService {
  constructor(private httpService: HttpService) {}

  handleRequest(url: string, request: Request): Observable<any> {
    const { method, params, headers, body } = request as any;

    const config: AxiosRequestConfig = {
      url,
      method: method as Method,
      headers,
      data: body,
      params
    };

    return this.httpService.request(config).pipe(
      map((response: any) => response.data),
      catchError(error => {
        throw new HttpException(error.response.data, error.response.status);
      })
    );
  }
}
