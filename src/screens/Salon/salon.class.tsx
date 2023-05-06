import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";
import { FirestoreDataConverter } from "@firebase/firestore";
import {ReviewClass} from "./review.class";

export class SalonClass {
    constructor(readonly id: string, readonly name: string, readonly location: string, readonly phoneNumber: string, readonly rating: number,
                readonly startTime: string, readonly endTime: string, readonly image: string, readonly reviews: ReviewClass[]) {}
}

export const salonConverter: FirestoreDataConverter<SalonClass> = {
    toFirestore(salon: WithFieldValue<SalonClass>): DocumentData {
        return {
            name: salon.name,
            phoneNumber: salon.phoneNumber,
            rating: salon.rating,
            location: salon.location,
            startTime: salon.startTime,
            endTime: salon.endTime,
            image: salon.image,
            reviews: salon.reviews
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot, options?: SnapshotOptions
    ): SalonClass {
        const data = snapshot.data(options)!
        return new SalonClass(data.id, data.name, data.location, data.phoneNumber, data.rating, data.startTime,
            data.endTime, data.image, data.reviews)
    }
};