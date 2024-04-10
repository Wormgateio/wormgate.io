import { useSearchParams } from "next/navigation"
import ChainStore from "../store/ChainStore"
import { BridgeType } from "../common/enums/BridgeType"
import { HYPERLANE_QUERY_PARAM_NAME } from "@utils/hyperlaneQueryParamName"
import { useNetwork } from "wagmi"

export const useGetChains = () => {
    const searchParams = useSearchParams()
    const { chain } = useNetwork();

    return () => {
        const isHyperlaneBridgeType = searchParams.get(HYPERLANE_QUERY_PARAM_NAME)

        ChainStore.getChains(isHyperlaneBridgeType ? BridgeType.Hyperlane : BridgeType.LayerZero, chain?.id)
    }
}