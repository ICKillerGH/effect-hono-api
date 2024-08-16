import { AttributesRepository } from "../repositories/attributes-repository";

export const getAttributes = AttributesRepository.findByCriteria;
