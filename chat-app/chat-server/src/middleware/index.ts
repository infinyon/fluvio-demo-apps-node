import {
    handleCors,
    handleBodyRequestParsing,
    handleCompression
} from "./otherHandlers";

export default [
    handleCors,
    handleBodyRequestParsing,
    handleCompression
];

