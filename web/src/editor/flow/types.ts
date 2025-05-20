import { UUID } from "crypto";
import { BaseFlowNode, walletAddresses, ContractMethodReference, ContractEventReference, FunctionNode, EventNode, VariableNode, ApiNode, DataNode, LogicNode, UiNode, FlowPort, FlowConnection, FlowNodeMetadata, FlowVariable, Timestamp, ChainId, NetworkName } from "../types";

interface EnhancedContractNode extends BaseFlowNode {
    type: 'contract';
    chain: 'ethereum' | 'solana' | 'sui';
    address: walletAddresses;
    
    // Chain-specific fields
    chainData: {
      // Ethereum
      ethereum?: {
        blockCreated?: number;
        abi: any; // Your existing ABI type
      };
      
      // Solana
      solana?: {
        programId: string;
        accountType: 'program' | 'mint' | 'metadata';
        upgradeable: boolean;
      };
      
      // Sui
      sui?: {
        packageId: string;
        moduleName: string;
        objectType: string;
      };
    };
    
    methods: ContractMethodReference[];
    events: ContractEventReference[];
  }

interface EnhancedContractMethodReference extends ContractMethodReference {
    payable?: boolean;
    stateMutability?: 'pure' | 'view' | 'nonpayable' | 'payable';
    gasEstimate?: number;
}

interface EnhancedContractEventReference extends ContractEventReference {
    anonymous?: boolean;
    indexedParameters?: number;
}

interface WalletNode extends BaseFlowNode {
    type: 'wallet';
    chain: 'ethereum' | 'solana' | 'sui';
    address: walletAddresses;
    
    // Chain-specific capabilities
    capabilities: {
      ethereum?: {
        canSign: boolean;
        canDeployContracts: boolean;
      };
      solana?: {
        canSignMultiple: boolean;
        canRequestAirdrop: boolean;
      };
      sui?: {
        canSponsorTransactions: boolean;
        canManageObjects: boolean;
      };
    };
  }

  interface TokenNode extends BaseFlowNode {
    type: 'token';
    chain: 'ethereum' | 'solana' | 'sui';
    standard: 'ERC20' | 'SPL' | 'SUI';
    address: walletAddresses;
    
    metadata: FlowNodeMetadata & {
      name: string;
      symbol: string;
      decimals: number;
      
      // Chain-specific extensions
      extensions: {
        ethereum?: {
          eip2612?: boolean; // Permit support
        };
        solana?: {
          mintAuthority?: string;
          freezeAuthority?: string;
        };
        sui?: {
          treasuryCap?: string;
        };
      };
    };
  }

interface NFTNode extends BaseFlowNode {
    type: 'nft';
    standard: 'ERC721' | 'ERC1155' | 'SPL' | 'SUI';
    chain: 'ethereum' | 'solana' | 'sui';
    address: walletAddresses;
    tokenId?: string; // string for all chains (Solana uses strings too)
    metadata: FlowNodeMetadata & {
      // Common Metadata (all chains)
      name: string;
      description?: string;
      image?: string;
      external_url?: string;
      animation_url?: string;
      
      // Chain-Specific Field Variations
      attributes: Array<{
        // Ethereum-style (OpenSea)
        trait_type?: string; 
        value: string | number;
        display_type?: 'string' | 'number' | 'date' | 'boost';
        
        // Solana-style (Metaplex)
        traitType?: string; // Alternate naming
        // SUI uses similar to Ethereum
      }>;
      
      // Chain-Specific Extensions
      extensions: {
        // Ethereum
        erc?: {
          royaltyInfo?: {
            receiver: walletAddresses;
            royaltyPercent: number;
          };
        };
        
        // Solana (Metaplex)
        spl?: {
          creators?: {
            address: walletAddresses;
            share: number;
            verified: boolean;
          }[];
          primarySaleHappened: boolean;
          sellerFeeBasisPoints: number;
        };
        
        // Sui
        sui?: {
          kiosk?: {
            id: string;
            owner: walletAddresses;
          };
          display?: Record<string, string>;
        };
      };
    };
    
    // Chain-Specific Technical Data
    chainData: {
      // Ethereum
      ethereum?: {
        blockNumberMinted?: number;
        tokenURI?: string;
      };
      
      // Solana
      solana?: {
        mintAddress: string;
        updateAuthority?: string;
        metadataAddress?: string;
        collection?: {
          verified: boolean;
          key: string;
        };
      };
      
      // Sui
      sui?: {
        objectId: string;
        version?: string;
        display?: {
          name?: string;
          description?: string;
          image_url?: string;
        };
      };
    };
  }

interface DeFiNode extends BaseFlowNode {
    type: 'defi';
    protocol: 'Uniswap' | 'Aave' | 'Compound' | string;
    action: 'swap' | 'lend' | 'borrow' | 'stake' | 'yield';
    parameters: Record<string, any>;
    slippage?: number;
}

/***********************
 * ENHANCED INTEGRATION TYPES
 ***********************/
type IntegrationService =
    | 'Clerk'
    | 'Neon'
    | 'Supabase'
    | 'Firebase'
    | 'IPFS'
    | 'TheGraph'
    | 'Alchemy'
    | 'Infura'
    | 'Moralis'
    | 'OpenAI'
    | 'Stripe'
    | 'Twilio';

interface IntegrationAuth {
    type: 'apiKey' | 'oauth' | 'jwt' | 'wallet';
    credentials: Record<string, string>;
}

interface IntegrationNode extends BaseFlowNode {
    type: 'integration';
    service: IntegrationService;
    config: Record<string, any>;
    authentication?: IntegrationAuth;
    rateLimiting?: {
        requests: number;
        interval: 'second' | 'minute' | 'hour';
    };
}

/***********************
 * AI CAPABILITIES
 ***********************/
interface AINode extends BaseFlowNode {
    type: 'ai';
    aiType: 'llm' | 'embedding' | 'image' | 'audio';
    model: string;
    prompt?: string;
    temperature?: number;
    maxTokens?: number;
    inputSchema?: any;
    outputSchema?: any;
    streaming?: boolean;
}

/***********************
 * ENHANCED TYPE SAFETY
 ***********************/
type EnhancedFlowNode =
    | EnhancedContractNode
    | WalletNode
    | TokenNode
    | NFTNode
    | DeFiNode
    | IntegrationNode
    | AINode
    | FunctionNode
    | EventNode
    | VariableNode
    | ApiNode
    | DataNode
    | LogicNode
    | UiNode;

type NodeType = EnhancedFlowNode['type'];

type NodeByType<T extends NodeType> = Extract<EnhancedFlowNode, { type: T }>;

/***********************
 * ERROR HANDLING & RESILIENCE
 ***********************/
interface EnhancedApiNode extends ApiNode {
    retryPolicy?: {
        maxAttempts: number;
        delay: number;
        backoff: 'linear' | 'exponential';
        statusCodes: number[];
    };
    timeout?: number;
    circuitBreaker?: {
        threshold: number;
        interval: number;
    };
}

interface EnhancedLogicNode extends LogicNode {
    errorHandling?: {
        type: 'retry' | 'continue' | 'fail' | 'custom';
        fallbackValue?: any;
        customHandler?: string;
    };
}

interface EnhancedFlowPort extends FlowPort {
    validation?: {
        required?: boolean;
        min?: number;
        max?: number;
        pattern?: string;
        custom?: string;
    };
}

/***********************
 * UTILITY TYPES
 ***********************/
type FlowNodeMap = Record<UUID, EnhancedFlowNode>;
type FlowConnectionMap = Record<UUID, FlowConnection>;

/***********************
 * ENHANCED METADATA
 ***********************/
interface EnhancedFlowNodeMetadata extends FlowNodeMetadata {
    tags?: string[];
    version?: string;
    createdBy: string;
    lastModifiedBy?: UUID;
    dependencies?: UUID[];
}

interface EnhancedFlowVariable extends FlowVariable {
    visibility: 'public' | 'private' | 'protected';
    encrypted?: boolean;
    auditTrail?: {
        modifiedBy: UUID;
        timestamp: Timestamp;
        oldValue?: any;
    }[];
}