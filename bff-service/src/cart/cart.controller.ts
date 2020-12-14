import { All, Controller, Req, HttpStatus, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ProxyService } from "../proxy/proxy.service";

@Controller("cart")
export class CartController {
  private readonly logger = new Logger(CartController.name);

  constructor(
    private cartService: ProxyService,
    private configService: ConfigService
  ) {}

  @All()
  handleRequest(@Req() request: any): any {
    const urlParams = request?.originalUrl.slice(1).split("/");
    const recipient = urlParams[0];
    const recipientUrl = this.configService.get<string>(recipient);

    this.logger.log(`Handling request with url ${recipientUrl}...`);

    if (recipientUrl) {
      const url = `${recipientUrl}/${urlParams.slice(1).join("/")}`;
      this.logger.log(`Requesting ${url} ...`);
      return this.cartService.handleRequest(url, request);
    }

    return {
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      message: "Cannot process request"
    };
  }
}
