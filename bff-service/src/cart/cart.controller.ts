import { All, Controller, Req, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ProxyService } from "../proxy/proxy.service";

@Controller("cart")
export class CartController {
  constructor(
    private cartService: ProxyService,
    private configService: ConfigService
  ) {}

  @All()
  handleRequest(@Req() request: any): any {
    const urlParams = request?.originalUrl.slice(1).split("/");
    const recipient = urlParams[0];
    const recipientUrl = this.configService.get<string>(recipient);

    if (recipientUrl) {
      const url = `${recipientUrl}/${urlParams.slice(1).join("/")}`;
      return this.cartService.handleRequest(url, request);
    }

    return {
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      message: "Cannot process request"
    };
  }
}
