import { 
  FeatureFlagStateEnum, FeatureFlags, FeatureFlagsResponse, NewFeatureFlag, ResponseError
} from "@/models/feature_flags"

interface IGetFlagsParams {
  skip: number;
  take: number;
}
export async function getFlags({ skip, take }: IGetFlagsParams): Promise<FeatureFlags[]> {
  let url = `${process.env.NEXT_PUBLIC_URL_BACKEND
    }/feature_flags`+
    `?skip=${skip}&take=${take}`;
  
  const flags = (await fetch(url).then((res) =>
    res.json()
  )) as FeatureFlagsResponse[]

  return flags.map((f) => ({
    ...f,
    state: f.state === FeatureFlagStateEnum.ON,
  }));
}

export async function changeStateFlag(id: string, isActive: boolean): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_URL_BACKEND
    }/feature_flags/${id}`;
  const state = isActive ? FeatureFlagStateEnum.OFF : FeatureFlagStateEnum.ON;
  
  await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ state }),
  });
}

export async function deleteFlag(id: string): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_URL_BACKEND
    }/feature_flags/${id}`;
  
  await fetch(url, {
    method: 'DELETE',
  });
}

export async function createFlag(flag: NewFeatureFlag): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_URL_BACKEND
    }/feature_flags`;

  const response = (await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(flag),
  }).then((res) =>
    res.json()
  )) as ResponseError

  if (response.statusCode !== 201) {
    throw new Error(response.message);
  }
}

export async function updateFlag(id: string, flag: NewFeatureFlag): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_URL_BACKEND
    }/feature_flags/${id}`;
  
    const response = (await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flag),
      }).then((res) =>
      res.json()
    )) as ResponseError
  
    if (response.statusCode !== 200) {
      throw new Error(response.message);
    }
}

export async function getFlag(id: string): Promise<FeatureFlagsResponse> {
  const url = `${process.env.NEXT_PUBLIC_URL_BACKEND
    }/feature_flags/${id}`;
  
  return (await fetch(url).then((res) =>
    res.json()
  )) as FeatureFlagsResponse
}