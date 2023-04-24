import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";
import { FirestoreDataConverter } from "@firebase/firestore";
import {UserClass} from "../Profile/user.class";
import firebase from "firebase/compat";
import DocumentReference = firebase.firestore.DocumentReference;

export class ReviewClass {
    constructor(readonly id: string, readonly message: string, readonly stars: number,
                readonly salonId: string, readonly client: DocumentReference<UserClass>) {
    }
}

export const reviewConverter: FirestoreDataConverter<ReviewClass> = {
    toFirestore(review: WithFieldValue<ReviewClass>): DocumentData {
        return {
            id: review.id,
            message: review.message,
            stars: review.stars,
            salonId: review.salonId,
            client: review.client
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot, options?: SnapshotOptions
    ): ReviewClass {
        const data = snapshot.data(options)!
        return new ReviewClass(data.id, data.message, data.stars, data.salonId, data.client)
    }
};