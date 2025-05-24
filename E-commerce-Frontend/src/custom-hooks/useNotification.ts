import { Notification } from "../../slices/notificationSlice";
import type { NotificationType } from "../types/Notification";
import { useAppDispatch } from "./useRedux";

const useNotification = () => {
  const dispatch = useAppDispatch();

  const showNotification = ( type: NotificationType, label?: string ) : void => {
    dispatch(
      Notification({
        type,
        label: label ?? "We are facing some technical issue",
      })
    );
  };

  return showNotification;
};

export default useNotification;
