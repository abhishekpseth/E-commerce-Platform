import { useEffect, useState, type JSX } from "react";

import { useAppDispatch, useAppSelector } from "../../custom-hooks/useRedux";

import { MdOutlineKeyboardArrowUp } from "react-icons/md";

import ProductService from "../../services/product.service";

import { setSearchToggle } from "../../../slices/searchSlice";

import useNotification from "../../custom-hooks/useNotification";

import Loading from "../Common/Loading/Loading";
import jwtUtils from "../../Utils/jwt/jwt.util";
import ProductCard from "./ProductCard/ProductCard";
import SelectBox from "../Common/SelectBox/SelectBox";
import PaginationComponent from "../Common/PaginationComponent/PaginationComponent";
import type { Product } from "../../types/Product";

interface FetchProductResponse {
  products: Product[];
  totalDataCount: number;
}

interface SortingOption {
  name: string;
  id: string;
}

interface FetchFiltersDropdownResponse {
  colors: string[],
  sizes: string[],
}

const ProductListing = () : JSX.Element => {
  const showNotification = useNotification();

  const { searchInput, searchToggle } = useAppSelector(
    (state) => state.searchSlice
  );
  const dispatch = useAppDispatch();

  const [products, setProducts] = useState<Product[]>([]);
  const [colorsDropdown, setColorsDropdown] = useState<string[]>([]);
  const [sizesDropdown, setSizesDropdown] = useState<string[]>([]);
  const [colorsDropdownToggle, setColorsDropdownToggle] = useState<boolean>(false);
  const [sizesDropdownToggle, setSizesDropdownToggle] = useState<boolean>(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataPerPage] = useState<number>(10);
  const [totalDataCount, setTotalDataCount] = useState<number>(0);
  const [selectedSortingOption, setSelectedSortingOption] = useState<SortingOption>({
    name: "What's New",
    id: "creationDateDesc",
  });

  const fetchProducts = (page: number, limit: number) : void => {
    const token = JSON.parse(localStorage.getItem("user-info") || "null")?.token;
    const userID = token ? jwtUtils.getJWTData(token)?._id : null;

    if(userID === undefined){
      showNotification("error");
      console.log("User ID is undefined", userID);
      return;
    }

    const selectedSortingOptionID = selectedSortingOption?.id;

    setLoading(true);
    ProductService.fetchAll(
      userID,
      searchInput,
      selectedColors,
      selectedSizes,
      selectedSortingOptionID,
      page,
      limit
    )
    .then((res : { status: number, data: FetchProductResponse }) => {
      if (res.status === 200) {
        setProducts(res.data.products || []);
        setTotalDataCount(res.data.totalDataCount);
      } else {
        showNotification("error", "Couldn't fetch Products");
      }
    })
    .catch((error) => {
      console.log(error);
      showNotification("error", "Couldn't fetch Products");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const filtersDropdown = () : void => {
    ProductService.fetchAllFiltersDropdown()
      .then((res : { status: number, data: FetchFiltersDropdownResponse }) => {
        if (res.status === 200) {
          setColorsDropdown(res?.data?.colors || []);
          setSizesDropdown(res?.data?.sizes || []);
        } else {
          showNotification("error", "Couldn't fetch filters dropdown");
        }
      })
      .catch((error) => {
        console.log(error);
        showNotification("error");
      });
  };

  const sizesFilterDropdownComparator = (a: string, b: string) : number => {
    const isNumA = !isNaN(Number(a));
    const isNumB = !isNaN(Number(b));

    if (isNumA && isNumB) {
      return Number(a) - Number(b);
    } else if (!isNumA && !isNumB) {
      return a.localeCompare(b);
    } else {
      return isNumA ? -1 : 1;
    }
  };

  const handleSizesCheckboxChange = (size : string) : void => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleColorCheckboxChange = (color : string) : void => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((s) => s !== color) : [...prev, color]
    );
  };

  const handleWishlistItem = (productId : string) : void => {
    setProducts((prevProducts : Product[]) =>
      prevProducts.map((product : Product) =>
        product._id === productId
          ? { ...product, isWishlisted: !product.isWishlisted }
          : product
      )
    );
  };

  const paginate = (pageNumber : number) => {
    setCurrentPage(pageNumber);
    fetchProducts(pageNumber, dataPerPage);
  };

  const handleChangeSortingOption = (option : SortingOption) => {
    setSelectedSortingOption(option);
  };

  useEffect(() => {
    fetchProducts(currentPage, dataPerPage);
    filtersDropdown();
  }, []);

  useEffect(() => {
    if (searchToggle) {
      fetchProducts(currentPage, dataPerPage);
      dispatch(setSearchToggle(false));
    }
  }, [searchToggle]);

  useEffect(() => {
    fetchProducts(currentPage, dataPerPage);
  }, [selectedSizes, selectedColors, selectedSortingOption]);

  return (
    <div className="z-10 pt-[20px] pb-[60px] overflow-auto h-full bg-white custom-scrollbar flex flex-col">
      <div className="flex flex-wrap items-start justify-between">
        <div className="flex flex-col">
          <div className="flex px-8">
            {/* Colors Filter Dropdown */}
            <div
              onClick={() => {
                setColorsDropdownToggle((prev) => !prev);
                setSizesDropdownToggle(false);
              }}
              className="flex items-center gap-[2px] px-2 py-1 hover:bg-gray-200 rounded-full cursor-pointer select-none"
            >
              <div className="text-sm font-thin text-gray-600">Colors</div>
              <MdOutlineKeyboardArrowUp
                className="text-xl text-gray-400"
                style={{
                  transform: colorsDropdownToggle
                    ? "rotate(0deg)"
                    : "rotate(180deg)",
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            </div>

            {/* Sizes Filter Dropdown */}
            <div
              onClick={() => {
                setSizesDropdownToggle((prev) => !prev);
                setColorsDropdownToggle(false);
              }}
              className="flex items-center gap-[2px] px-2 py-1 hover:bg-gray-200 rounded-full cursor-pointer select-none"
            >
              <div className="text-sm font-thin text-gray-600">Sizes</div>
              <MdOutlineKeyboardArrowUp
                className="text-xl text-gray-400"
                style={{
                  transform: sizesDropdownToggle
                    ? "rotate(0deg)"
                    : "rotate(180deg)",
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            </div>
          </div>

          <div className="flex items-start justify-between px-10 py-2">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {colorsDropdownToggle &&
                colorsDropdown.sort().map((dropdown, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      className="w-4 h-4 border-2 border-gray-400 rounded accent-pink-500"
                      onChange={() => handleColorCheckboxChange(dropdown)}
                    />
                    <div className="text-[14px] select-none">{dropdown}</div>
                  </div>
                ))}

              {sizesDropdownToggle &&
                sizesDropdown
                  .sort((a, b) => sizesFilterDropdownComparator(a, b))
                  .map((dropdown, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        className="w-4 h-4 border-2 border-gray-400 rounded accent-pink-500"
                        onChange={() => handleSizesCheckboxChange(dropdown)}
                      />
                      <div className="text-[14px] select-none">{dropdown}</div>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Sorting */}
        <div className="px-8">
          <SelectBox
            label="Sort By"
            optionName="name"
            optionValue="id"
            options={[
              {
                name: "Price: High to Low",
                id: "priceDesc",
              },
              {
                name: "Price: Low to High",
                id: "priceAsc",
              },
              {
                name: "What's New",
                id: "creationDateDesc",
              },
            ]}
            value={selectedSortingOption}
            handleChange={(option : SortingOption) => handleChangeSortingOption(option)}
          />
        </div>
      </div>

      <div className="h-[1px] mt-2 w-full bg-gray-200">&nbsp;</div>

      <div className="flex flex-wrap flex-1 gap-[40px] p-5 bg-white relative justify-center">
        {loading ? (
          <Loading />
        ) : (
          products.map((product, index) => (
            <ProductCard
              key={index}
              product={product}
              handleWishlistItem={handleWishlistItem}
            />
          ))
        )}
      </div>

      {!loading && products.length > 0 && (
        <PaginationComponent
          currentPage={currentPage}
          totalDataCount={totalDataCount}
          dataPerPage={dataPerPage}
          paginate={paginate}
        />
      )}
    </div>
  );
};

export default ProductListing;
