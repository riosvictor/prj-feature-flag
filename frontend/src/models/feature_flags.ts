export type NewFeatureFlag = {
  name: string;
  description: string;
  state: FeatureFlagStateEnum;
};

export type FeatureFlagsResponse = NewFeatureFlag & {
  id: string;
};

export type FeatureFlags = {
  id: string;
  name: string;
  description: string;
  state: boolean;
};

export enum FeatureFlagStateEnum {
  ON = 'ON',
  OFF = 'OFF',
}

export type ResponseError = {
  message: string;
  error: string;
  statusCode: number;
}
