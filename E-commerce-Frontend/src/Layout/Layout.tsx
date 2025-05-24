import { useEffect, type JSX, type ReactNode } from "react";

import CartService from "../services/cart.service";

import { setCartSize } from "../../slices/cartSlice";
import { useAppDispatch, useAppSelector } from "../custom-hooks/useRedux";

import useNotification from "../custom-hooks/useNotification";
import NotificationBox from "../components/Common/Notification/NotificationBox";

import NavBar from "../components/NavBar/NavBar";
import userUtils from "../Utils/User/User.util";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children } : LayoutProps) : JSX.Element => {
  const showNotification = useNotification();
  
  const notifications = useAppSelector((state) => state.notificationSlice.notifications);

  const dispatch = useAppDispatch();

  const getCartSizeForUser = () => {
    CartService.cartSize()
      .then((res) => {
        if (res.status === 200) {
          dispatch(setCartSize(res?.data?.cartSize || 0));
        } else {
          showNotification("error", "Couldn't fetch cart size");
        }
      })
      .catch((error) => {
        console.log(error);
        showNotification("error");
      });
  };

  useEffect(() => {
    if (userUtils.isLoggedIn()) {
      getCartSizeForUser();
    } else {
      dispatch(setCartSize(0));
    }
  }, []);

  return (
    <div className="flex flex-col gap-2 h-[100vh] bg-white overflow-hidden">
      {/* NavBar */}
      <NavBar />

      <div className="relative flex-1 overflow-hidden">
        {/* Remaining Portion */}
        {children}

        {/* Notifications */}
        {notifications.length > 0 &&
          notifications.map((notification, index) => <NotificationBox key={notification.id} id={notification.id} index={index} type={notification.type} label={`${notification.label}`} />)}
      </div>
    </div>
  );
};

export default Layout;
