export function getError(error: any) {
  if (error.response && error.response.data) {
    if (error.response.data.error) {
      return error.response.data.error;
    } else {
      return JSON.stringify(error.response.data);
    }
  } else if (error.message) {
    return error.message;
  } else {
    return JSON.stringify(error);
  }
}
