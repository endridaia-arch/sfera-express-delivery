"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authenticateUser, createBusinessUser, updateBusinessProfile, updatePricingRecords, updateShipmentProgress } from "@/lib/store";
import { signInUser, signOutCurrentUser, requireAdminUser, requireBusinessUser } from "@/lib/auth";
import { isOperatingCity, OPERATING_CITY_NAMES, SHIPMENT_STATUSES } from "@/lib/constants";

export type FormState = {
  error?: string;
  success?: string;
};

function readString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function readNumber(formData: FormData, key: string, fallback = 0) {
  const raw = Number(formData.get(key));
  return Number.isFinite(raw) ? raw : fallback;
}

function readOptionalNumber(formData: FormData, key: string) {
  const value = String(formData.get(key) || "").trim();
  if (!value) {
    return undefined;
  }

  const raw = Number(value);
  return Number.isFinite(raw) ? raw : undefined;
}

export async function loginAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = readString(formData, "email");
  const password = readString(formData, "password");

  if (!email || !password) {
    return { error: "Ploteso email-in dhe fjalekalimin." };
  }

  const user = await authenticateUser(email, password);
  if (!user) {
    return { error: "Email ose fjalekalim i pasakte." };
  }

  await signInUser(user);

  if (user.role === "admin") {
    redirect("/center");
  }

  redirect("/portal");
}

export async function registerBusinessAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const city = readString(formData, "city");

  if (!isOperatingCity(city)) {
    return { error: "Zgjidh nje nga qytetet ku operon Sfera Express." };
  }

  try {
    const user = await createBusinessUser({
      contactName: readString(formData, "contactName"),
      businessName: readString(formData, "businessName"),
      email: readString(formData, "email"),
      password: readString(formData, "password"),
      phone: readString(formData, "phone"),
      city,
      address: readString(formData, "address"),
    });

    await signInUser(user);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Regjistrimi deshtoi.",
    };
  }

  redirect("/portal");
}

export async function logoutAction() {
  await signOutCurrentUser();
  redirect("/");
}

export async function updateProfileAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireBusinessUser();
  const city = readString(formData, "city");

  if (!isOperatingCity(city)) {
    return { error: "Qyteti duhet te jete nje nga qytetet operative." };
  }

  try {
    await updateBusinessProfile(user.id, {
      contactName: readString(formData, "contactName"),
      businessName: readString(formData, "businessName"),
      email: readString(formData, "email"),
      phone: readString(formData, "phone"),
      city,
      address: readString(formData, "address"),
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Profili nuk u perditesua.",
    };
  }

  revalidatePath("/portal");
  revalidatePath("/portal/profile");
  return { success: "Profili u perditesua." };
}

export async function updatePricingAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdminUser();

  try {
    await updatePricingRecords(
      OPERATING_CITY_NAMES.map((city) => ({
        city,
        price: readNumber(formData, `price-${city}`, 0),
        threshold: readNumber(formData, `threshold-${city}`, 25),
      })),
    );
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Tarifat nuk u ruajten.",
    };
  }

  revalidatePath("/center");
  revalidatePath("/");
  return { success: "Tarifat dhe pragjet u ruajten." };
}

export async function updateShipmentProgressAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdminUser();

  const status = readString(formData, "status");
  if (!SHIPMENT_STATUSES.includes(status as (typeof SHIPMENT_STATUSES)[number])) {
    return { error: "Statusi i zgjedhur nuk eshte valid." };
  }

  try {
    await updateShipmentProgress({
      trackingCode: readString(formData, "trackingCode"),
      status: status as (typeof SHIPMENT_STATUSES)[number],
      location: readString(formData, "currentLocation"),
      note: readString(formData, "statusNote"),
      lat: readOptionalNumber(formData, "currentLat"),
      lng: readOptionalNumber(formData, "currentLng"),
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Tracking-u nuk u perditesua.",
    };
  }

  revalidatePath("/center");
  revalidatePath("/portal");
  return { success: "Tracking-u u perditesua." };
}
