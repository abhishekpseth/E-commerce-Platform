import { useEffect, useState, type JSX } from "react";

import OrderService from "../../../services/order.service";

import useNotification from "../../../custom-hooks/useNotification";

import Loading from "../../Common/Loading/Loading";
import SelectBox from "../../Common/SelectBox/SelectBox";
import UpdateRiderModal from "./UpdateRiderModal/UpdateRiderModal";
import ChangeStatusModal from "./ChangeStatusModal/ChangeStatusModal";
import AdminOrderItemCard from "./AdminOrderItemCard/AdminOrderItemCard";
import PaginationComponent from "../../Common/PaginationComponent/PaginationComponent";
import ProductDetailsModal from "../../Orders/ProductDetailsModal/ProductDetailsModal";
import type { AdminOrder } from "../../../types/Order";

interface DataPeriod {
  name: string;
  value: string;
}

const AdminDashboard = () : JSX.Element => {
  const showNotification = useNotification();
  
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showProductDetails, setShowProductDetails] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isOrderStatusModalOpen, setIsOrderStatusModalOpen] = useState<boolean>(false);
  const [isRiderModalOpen, setIsRiderModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataPerPage] = useState<number>(10);
  const [totalDataCount, setTotalDataCount] = useState<number>(0);
  const [selectedDataPeriod, setSelectedDataPeriod] = useState<DataPeriod>({
    name: "All",
    value: "All",
  });

  const fetchOrders = (page: number, limit: number) => {
    setLoading(true);
    const selectedDataPeriodValue = selectedDataPeriod?.value;
    OrderService.fetchAll(selectedDataPeriodValue, page, limit)
      .then((res: { status: number, data: { orders: AdminOrder[], totalDataCount: number }}) => {
        if (res.status === 200) {
          setOrders(res.data.orders);
          setTotalDataCount(res.data.totalDataCount);
        } else if (res.status === 403) {
          showNotification("warning", "You're not authorized to view this");
        } else {
          showNotification("error", "Couldn't fetch Orders");
        }
      })
      .catch((error) => {
        console.log(error);
        showNotification("error", "Couldn't fetch Orders");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const paginate = (pageNumber : number) : void => {
    setCurrentPage(pageNumber);
    fetchOrders(pageNumber, dataPerPage);
  };

  const handleChangeDataPeriod = (period : DataPeriod) : void => {
    setSelectedDataPeriod(period);
  };

  useEffect(() => {
    fetchOrders(currentPage, dataPerPage);
  }, []);

  useEffect(() => {
    fetchOrders(currentPage, dataPerPage);
  }, [selectedDataPeriod]);

  if (loading) {
    return (
      <div className="relative w-full h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative pb-[60px] h-full overflow-hidden">
      <div className="h-full p-4 overflow-x-hidden overflow-y-auto bg-white sm:p-8 custom-scrollbar">
        <div className="flex flex-wrap items-center justify-between py-2">
          <h1 className="mb-6 text-2xl font-bold text-gray-600">
            Admin Dashboard
          </h1>
          <SelectBox
            label="Period"
            optionName="name"
            optionValue="value"
            options={[
              {
                name: "Today",
                value: "today",
              },
              {
                name: "Last 7 days",
                value: "sevenDays",
              },
              {
                name: "This Month",
                value: "thisMonth",
              },
              {
                name: "This Year",
                value: "thisYear",
              },
              {
                name: "All",
                value: "All",
              },
            ]}
            value={selectedDataPeriod}
            handleChange={(option : DataPeriod) => handleChangeDataPeriod(option)}
          />
        </div>
        {orders.length === 0 ? (
          <div className="text-center text-gray-500">No orders available.</div>
        ) : (
          <div className="flex flex-col flex-1 gap-[40px] p-2 relative bg-white items-center transition-transform duration-300 ease-in-out">
            {orders.map((item, index) => (
              <AdminOrderItemCard
                key={index}
                orderItem={item}
                showProductDetails={showProductDetails}
                setShowProductDetails={setShowProductDetails}
                selectedOrder={selectedOrder}
                setSelectedOrder={setSelectedOrder}
                setIsOrderStatusModalOpen={setIsOrderStatusModalOpen}
                setIsRiderModalOpen={setIsRiderModalOpen}
              />
            ))}
          </div>
        )}
      </div>

      {!loading && orders.length > 0 && (
        <PaginationComponent
          currentPage={currentPage}
          totalDataCount={totalDataCount}
          dataPerPage={dataPerPage}
          paginate={paginate}
        />
      )}

      {selectedOrder?._id && (
        <ProductDetailsModal
          dbOrderID={selectedOrder?._id}
          showProductDetails={showProductDetails}
          setShowProductDetails={setShowProductDetails}
          setSelectedOrder={setSelectedOrder}
        />
      )}

      {isOrderStatusModalOpen && selectedOrder && (
        <ChangeStatusModal
          dbOrderID={selectedOrder?._id}
          selectedOrderStatus={selectedOrder?.status}
          statusOptions={["Paid", "Shipped"]}
          fetchOrders={() => fetchOrders(currentPage, dataPerPage)}
          setSelectedOrder={setSelectedOrder}
          setIsOrderStatusModalOpen={setIsOrderStatusModalOpen}
        />
      )}

      {isRiderModalOpen && selectedOrder && (
        <UpdateRiderModal
          dbOrderID={selectedOrder?._id}
          selectedOrderRiderID={selectedOrder?.riderID}
          fetchOrders={() => fetchOrders(currentPage, dataPerPage)}
          setSelectedOrder={setSelectedOrder}
          setIsRiderModalOpen={setIsRiderModalOpen}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
