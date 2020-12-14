import {
  All,
  Controller,
  Get,
  Req,
  UseInterceptors,
  CacheInterceptor,
  HttpStatus,
  Logger
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { ProxyService } from "../proxy/proxy.service";

@Controller("product")
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(
    private productsService: ProxyService,
    private configService: ConfigService
  ) {}

  @Get("products")
  @UseInterceptors(CacheInterceptor)
  handleProducts(@Req() request: Request): any {
    const recipientUrl = this.configService.get<string>("product");
    const url = `${recipientUrl}/products`;
    return this.productsService.handleRequest(url, request);
  }

  @All()
  handleRequest(@Req() request: any): any {
    const urlParams = request.originalUrl.slice(1).split("/");
    const recipient = urlParams[0];
    const recipientUrl = this.configService.get<string>(recipient);

    this.logger.log(
      `Handling request with url ${recipientUrl} ${recipient} ${urlParams}...`
    );

    if (recipientUrl) {
      const url = `${recipientUrl}/${urlParams.slice(1).join("/")}`;
      this.logger.log(`Requesting ${url}...`);
      return this.productsService.handleRequest(url, request);
    }

    return {
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      message: "Cannot process request"
    };
  }
}
