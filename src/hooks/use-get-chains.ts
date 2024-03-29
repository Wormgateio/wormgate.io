import { useSearchParams } from "next/navigation"
import ChainStore from "../store/ChainStore"
import { BridgeType } from "../common/enums/BridgeType"
import { HYPERLANE_QUERY_PARAM_NAME } from "@utils/hyperlaneQueryParamName"

export const useGetChains = () => {
    const searchParams = useSearchParams()

    return () => {
        const isHyperlaneBridgeType = searchParams.get(HYPERLANE_QUERY_PARAM_NAME)

        ChainStore.getChains(isHyperlaneBridgeType ? BridgeType.Hyperlane : BridgeType.LayerZero)
    }
}