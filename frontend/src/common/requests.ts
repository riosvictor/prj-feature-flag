import { 
  FeatureFlagStateEnum, FeatureFlags, FeatureFlagsResponse, NewFeatureFlag
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

export async function createFlag(flag: NewFeatureFlag): Promise<boolean> {
  const url = `${process.env.NEXT_PUBLIC_URL_BACKEND
    }/feature_flags`;
  
    try {
      const { status } = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flag),
      });
  
      return status === 201;
    } catch (err) {
      console.error('Error creating feature flag:', err);
      return false;
    }
}

export async function updateFlag(id: string, flag: NewFeatureFlag): Promise<boolean> {
  const url = `${process.env.NEXT_PUBLIC_URL_BACKEND
    }/feature_flags/${id}`;
  
    try {
      const { status } = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flag),
      });
  
      return status === 200;
    } catch (err) {
      console.error('Error updating feature flag:', err);
      return false;
    }
}

export async function getFlag(id: string): Promise<FeatureFlagsResponse> {
  const url = `${process.env.NEXT_PUBLIC_URL_BACKEND
    }/feature_flags/${id}`;
  
  return (await fetch(url).then((res) =>
    res.json()
  )) as FeatureFlagsResponse
}