import { useSearchParams } from "next/navigation"
import ChainStore from "../store/ChainStore"
import { NetworkType } from "../common/enums/NetworkType"
import { HYPERLANE_QUERY_PARAM_NAME } from "@utils/hyperlaneQueryParamName"

export const useGetChains = () => {
    const searchParams = useSearchParams()

    return () => {
        const isHyperlaneNetworkType = searchParams.get(HYPERLANE_QUERY_PARAM_NAME)

        ChainStore.getChains(isHyperlaneNetworkType ? NetworkType.Hyperlane : NetworkType.LayerZero)
    }
}