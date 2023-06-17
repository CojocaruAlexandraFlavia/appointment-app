import {Button, FormControl, Input, Modal, View, VStack, WarningOutlineIcon} from "native-base";
import React, {useState} from "react";
import {Rating} from "react-native-ratings";
import {ReviewClass} from "./review.class";
import {userConverter} from "../Profile/user.class";
import {useUserDataContext} from "../../store/user-data.context";
import {arrayUnion, doc, getDoc, updateDoc} from "firebase/firestore";
import {firestore} from "../../utils/firebase";
import {salonConverter} from "./salon.class";
import {Loading} from "../../components/activity-indicator.component";

const emptyReview: Partial<ReviewClass> = {
    message: "",
    stars: 1,
}

type AddReviewProp = {
    salonId: string,
    retrieveSalon: Function
}

const AddReviewModal = ({salonId, retrieveSalon}: AddReviewProp) => {

    const [openModal, setOpenModal] = useState(false)
    const [review, setReview] = useState<Partial<ReviewClass>>(emptyReview)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const {user} = useUserDataContext()

    const closeModal = () => {
        setOpenModal(false)
        setReview(emptyReview)
        setError(false)
    }

    const setReviewStars = (stars: number) => {
        setReview({...review, stars})
    }

    const submitReview =  async() => {
        setLoading(true)
        const userRef = doc(firestore, "users", user.id).withConverter(userConverter)
        const salonRef = doc(firestore, "salons", salonId).withConverter(salonConverter)
        const salonDocument = await getDoc(salonRef)
        if (salonDocument.exists()) {
            updateDoc(salonRef, {
                reviews: arrayUnion({...review, client: userRef, id: salonDocument.data().reviews.length + 1}),
                nrOfReviews: salonDocument.data()?.nrOfReviews + 1,
                // @ts-ignore
                nrOfStars: salonDocument.data()?.nrOfStars + review.stars,
                // @ts-ignore
                rating: ((salonDocument.data()?.nrOfStars + review.stars) / ( salonDocument.data()?.nrOfReviews + 1 )).toFixed(2)
            }).then( async () => {
                retrieveSalon().then(() => {
                    setLoading(false)
                    closeModal()
                })
            })
        }
    }

    return(
        <View>
            <Button colorScheme={"darkBlue"} onPress={() => setOpenModal(true)}>Add review</Button>

            <Modal isOpen={openModal} onClose={closeModal} size={"xl"}>
                <Modal.Content>
                    {
                        loading && <Loading/>
                    }
                    <Modal.CloseButton/>
                    <Modal.Header>Add review</Modal.Header>
                    <Modal.Body>
                        <FormControl isInvalid={error}>
                            <View display={"flex"}>
                                <VStack>
                                    <Rating minValue={1} startingValue={1} imageSize={30} onFinishRating={setReviewStars} />
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>Please make a selection!</FormControl.ErrorMessage>
                                </VStack>
                            </View>
                            <Input placeholder="Write a message about salon..." value={review.message} onChangeText={(text) => setReview({...review, message: text})}/>
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button colorScheme={"green"} onPress={submitReview}>Submit</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </View>

    )

}
export default AddReviewModal