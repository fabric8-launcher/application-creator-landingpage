export default interface RestCapabilityApi {
  get(name: string): Promise<string>;
}