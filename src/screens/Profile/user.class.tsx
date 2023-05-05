import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";
import { FirestoreDataConverter } from "@firebase/firestore";

export class UserClass {
    constructor(readonly id: string, readonly firstName: string, readonly lastName: string, readonly email: string,
                readonly phoneNumber: string, readonly city: string, readonly role: string, readonly profilePicture: string,
                readonly username: string) {
    }
}

export const userConverter: FirestoreDataConverter<UserClass> = {
    toFirestore(user: WithFieldValue<UserClass>): DocumentData {
        return {
            // id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            city: user.city,
            role: user.role,
            profilePicture: user.profilePicture,
            username: user.username
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot, options?: SnapshotOptions
    ): UserClass {
        const data = snapshot.data(options)!
        return new UserClass(data.id, data.firstName, data.lastName, data.email, data.phoneNumber, data.city,
            data.role, data.profilePicture, data.username)
    }
};