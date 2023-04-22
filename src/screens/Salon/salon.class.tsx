import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";
import { FirestoreDataConverter } from "@firebase/firestore";

class Salon {
    constructor(readonly id: string, readonly name: string, readonly location: string, readonly phoneNumber: string,
                readonly rating: number, readonly startTime: string, readonly endTime: string) {
        // this.id = id
        // this.name = name
        // this.location = location
        // this.phoneNumber = phoneNumber
        // this.rating = rating
        // this.startTime = startTime
        // this.endTime = endTime
    }
}

export const salonConverter: FirestoreDataConverter<Salon> = {
    toFirestore(salon: WithFieldValue<Salon>): DocumentData {
        return {
            id: salon.id,
            name: salon.name,
            phoneNumber: salon.phoneNumber,
            rating: salon.rating,
            location: salon.location,
            startTime: salon.startTime,
            endTime: salon.endTime
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot, options?: SnapshotOptions
    ): Salon {
        const data = snapshot.data(options)!
        return new Salon(data.id, data.name, data.location, data.phoneNumber, data.rating, data.startTime, data.endTime)
    }
};