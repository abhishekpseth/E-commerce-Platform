import { useState, type JSX } from "react";

import SelectAddressModal from "./SelectAddressModal/SelectAddressModal";
import AddNewAddressModal from "./AddNewAddressModal/AddNewAddressModal";
import type { Address } from "../../../types/User";

interface AddressModalPayload {
  addresses: Address[];
  fetchAllAddresses: () => void;
  selectedAddressID: string | null;
  setSelectedAddressID: (selectedAddressID: string | null) => void;
  setIsAddressModalOpen: (isAddressModalOpen : boolean) => void;
}

const AddressModal = ({ addresses, fetchAllAddresses, selectedAddressID, setSelectedAddressID, setIsAddressModalOpen } : AddressModalPayload) : JSX.Element => {
  const [isAddNewAddressModalOpen, setAddNewAddressModalOpen] = useState<boolean>(false);

  if (!isAddNewAddressModalOpen) {
    return <SelectAddressModal setAddNewAddressModalOpen={setAddNewAddressModalOpen} fetchAllAddresses={fetchAllAddresses} addresses={addresses} selectedAddressID={selectedAddressID} setSelectedAddressID={setSelectedAddressID} setIsAddressModalOpen={setIsAddressModalOpen}/>;
  } else {
    return <AddNewAddressModal setAddNewAddressModalOpen={setAddNewAddressModalOpen} fetchAllAddresses={fetchAllAddresses} />;
  }
};

export default AddressModal;
