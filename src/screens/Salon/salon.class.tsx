import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";
import { FirestoreDataConverter } from "@firebase/firestore";
import {ReviewClass} from "./review.class";

export class SalonClass {
    constructor(readonly id: string, readonly name: string, readonly phoneNumber: string, readonly rating: number,
                readonly startTime: string, readonly endTime: string, readonly image: string, readonly reviews: ReviewClass[],
                readonly nrOfReviews: number, readonly enabled: boolean, readonly city: string, readonly country: string,
                readonly address: string, readonly nrOfStars: number) {}
}

export const salonConverter: FirestoreDataConverter<SalonClass> = {
    toFirestore(salon: WithFieldValue<SalonClass>): DocumentData {
        return {
            name: salon.name,
            phoneNumber: salon.phoneNumber,
            rating: salon.rating,
            startTime: salon.startTime,
            endTime: salon.endTime,
            image: salon.image,
            reviews: salon.reviews,
            nrOfReviews: salon.nrOfReviews,
            enabled: salon.enabled,
            city: salon.city,
            country: salon.country,
            address: salon.address,
            nrOfStars: salon.nrOfStars
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot, options?: SnapshotOptions
    ): SalonClass {
        const data = snapshot.data(options)!
        return new SalonClass(data.id, data.name, data.phoneNumber, data.rating, data.startTime,
            data.endTime, data.image, data.reviews, data.nrOfReviews, data.enabled, data.city, data.country, data.address, data.nrOfStars)
    }
};