declare module "node-persist" {
  const nodePersist: {
    init(options?: Record<string, any>): Promise<void>;
    getItem(key: string): Promise<any>;
    setItem(key: string, value: any): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
  };
  export = nodePersist;
}
