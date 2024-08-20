import { ManagedRuntime } from "effect";
import { AttributesRepository } from "../attributes/repositories/attributes-repository";

export const runtime = ManagedRuntime.make(AttributesRepository.Live);
