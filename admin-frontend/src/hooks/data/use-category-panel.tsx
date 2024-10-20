import { useUserContext } from '@/context/userContext';
import useAxioRequests from '@/lib/axioRequest';
import { TServiceCategory } from '@/lib/commonTypes';
import ROUTES from '@/lib/routes';
import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useCategoryPanel = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useUserContext();
    const { HandleGetRequest, HandlePostRequest } = useAxioRequests();

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalToggle, setModalToggle] = useState(false)

    const [categoryList, setCategoryList] = useState<TServiceCategory[]>([] as TServiceCategory[]);
    const [filteredList, setFilteredList] = useState<TServiceCategory[]>([] as TServiceCategory[]);
  
    useLayoutEffect(() => {
        if(!isLoggedIn) navigate('../auth/sign-in')
    }, [isLoggedIn])

    useEffect(() => {
        loading && handleGetQueryRequest(ROUTES.commonCategoryRoute)
    }, [loading])

    // Filter the Vehicle List Items
    useEffect(() => {
        let tempList = categoryList;
        if(categoryList?.length > 0 && searchTerm !== '') tempList = tempList.filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase()));

        startTransition(() => setFilteredList(tempList))
    }, [searchTerm, categoryList])

    // Handle Get Requests
    async function handleGetQueryRequest(route: string) {
        const response = await HandleGetRequest({ route: route });
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(false);
                setCategoryList(response.data)
            });
        }
    }

    // Handle Confirmation
    function handleConfirmation(){
        startTransition(() => {
            setLoading(true)
            setModalToggle(false)
        })
    }

    // Handle Vehicle Deletion
    async function handleCategoryDeletion(categoryID: string){
        const response = await HandlePostRequest({
            data: { categoryID: categoryID },
            route: `${ROUTES.commonCategoryRoute}/${categoryID}`,
            type: 'delete',
            toastDescription: 'Category has deleted successfully'
        })
        if(response?.status === 200) handleConfirmation();
    } 

    return {
        filteredList,
        searchTerm,
        modalToggle, 
        setModalToggle,
        setSearchTerm,     
        handleCategoryDeletion,
        handleConfirmation,
    }
}

export default useCategoryPanel