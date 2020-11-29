import "source-map-support/register";

import { getProductsList } from "./src/getProductsList/getProductsList";
import { getProductsById } from "./src/getProductsById/getProductsById";
import { createProduct } from "./src/createProduct/createProduct";
import { catalogBatchProcess } from "./src/catalogBatchProcess/catalogBatchProcess";

export { getProductsList, getProductsById, createProduct, catalogBatchProcess };
