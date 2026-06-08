export interface IErrorSource {
  path: string;
  message: string;
}
export const handleZodError = (err: any) => {
  const errorSource: IErrorSource[] = err.issues.map((issue: any) => {
    return {
      path: issue.path[issue.path.length - 1], 
      message: issue.message, 
    };
  });

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSource,
  };
};