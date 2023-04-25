import {FirestoreDataConverter} from "@firebase/firestore";
import {DocumentData, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue} from "firebase/firestore";

class AppointmentClass {
    constructor(readonly id: string, readonly serviceName: string, readonly date: string, readonly time: string,
                readonly salonId: string, readonly clientId: string) {}
}

export const appointmentConverter: FirestoreDataConverter<AppointmentClass> = {
    toFirestore(appointment: WithFieldValue<AppointmentClass>): DocumentData {
        return {
            id: appointment.id,
            serviceName: appointment.serviceName,
            date: appointment.date,
            salonId: appointment.salonId,
            clientId: appointment.clientId,
            time: appointment.time
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot, options?: SnapshotOptions
    ): AppointmentClass {
        const data = snapshot.data(options)!
        return new AppointmentClass(data.id, data.serviceName, data.date, data.time, data.salonId, data.clientId)
    }
};