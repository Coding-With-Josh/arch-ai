import React from 'react'
import ClientPage from './client-page'
import { EditorProvider } from '@/editor/editor-provider'
import { auth } from '@/app/api/auth/[...nextauth]/auth-options'
import type {
  Editor, UUID, AssetID,
  EditorState, DesignViewState, CanvasState, Breakpoint, Artboard, DesignElement,
  InteractionState, ViewportState, FlowViewState, FlowNode, EditorVersion, EditorSnapshot, EditorData,
  EditorCollaborator, EditorSettings, EditorEnvironment
} from '@/editor/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SignInButton } from '@/components/navbar/sign-in-button'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

const Page = async ({ params }: { params: { editorSlug: string; projectSlug: string, workspaceSlug } }) => {
  const session = await auth()
  const editor = await prisma.editor.findUnique({
    where: {
      slug: params.editorSlug
    }
  })

  if (!editor) {
    throw new Error("yooo")
  }

  // Define the design view state
  const designView: DesignViewState = {
    canvas: {
      type: '2d',
      dimensions: { width: 1440, height: 1024 },
      background: {
        type: 'color',
        color: "#ffffff" as any,
        opacity: 1,
        blendMode: "normal"
      },
      grid: {
        enabled: true,
        size: 10,
        subdivisions: 5,
        color: "#e0e0e0" as any,
        opacity: 0.5,
        snapping: { enabled: true, strength: 0.5 }
      },
      breakpoints: [
        {
          id: "bp_mobile" as UUID,
          name: "Mobile",
          minWidth: 0,
          maxWidth: 767,
          baseFontSize: 16,
          icon: "asset_icon_mobile" as AssetID
        },
        {
          id: "bp_tablet" as UUID,
          name: "Tablet",
          minWidth: 768,
          maxWidth: 1023,
          baseFontSize: 18,
          icon: "asset_icon_tablet" as AssetID
        }
      ],
      currentBreakpointId: "bp_mobile" as UUID,
      artboards: [
        {
          id: "artboard_1" as UUID,
          name: "Main Screen",
          position: { x: 100, y: 100 },
          dimensions: { width: 375, height: 812 },
          background: {
            type: 'color',
            color: "#ffffff" as any,
            opacity: 1,
            blendMode: "normal"
          },
          isRoot: true,
          meta: { device: "iPhone 13", orientation: 'portrait' }
        }
      ],
      currentArtboardId: "artboard_1" as UUID
    },
    elements: [
      // {
      //   id: "element_1" as UUID,
      //   position: { x: 50, y: 100 },
      //   dimensions: { width: 200, height: 100 },
      //   props: {
      //     style: {
      //       fills: [{
      //         type: 'solid',
      //         color: "#4f46e5" as any,
      //         opacity: 1,
      //         blendMode: "normal"
      //       }],
      //       borders: [],
      //       shadows: [],
      //       effects: [],
      //       opacity: 1,
      //       blendMode: "normal",
      //       filters: [],
      //       // clip: { enabled: false, mode: 'rect' },
      //       overflow: 'visible'
      //     },
      //   },
      //   constraints: {
      //     horizontal: 'scale',
      //     vertical: 'scale'
      //   },
      //   childrenIds: [],
      //   meta: {
      //     name: "rectangle",
      //     created: Date.now(),
      //     modified: Date.now(),
      //     createdBy: "user_1" as UUID,
      //     tags: ["button"]
      //   }
      // }
    ],
    selectedElements: [],
    hoveredElement: undefined,
    interactionState: {
      mode: 'select',
      status: 'idle'
    },
    viewport: {
      position: { x: 0, y: 0 },
      zoom: 1,
      dimensions: { width: 1440, height: 800 },
      visibleRect: {
        position: { x: 0, y: 0 },
        dimensions: { width: 1440, height: 800 }
      }
    },
    guides: [],
    assetOverrides: []
  }

  // Define the flow view state
  const flowView: FlowViewState = {
    elementBindings: [],
    nodes: [
      {
        id: "node_1" as UUID,
        type: 'ui',
        position: { x: 100, y: 200 },
        dimensions: { width: 200, height: 100 },
        title: "Button Click",
        description: "Triggered when button is clicked",
        style: {
          backgroundColor: "#ffffff",
          borderColor: "#e5e7eb",
          textColor: "#111827",
          borderWidth: 1,
          borderRadius: 4
        },
        ports: [
          {
            id: "port_1" as UUID,
            type: 'output',
            dataType: "event",
            name: "onClick",
            isArray: false,
            isOptional: false
          }
        ],
        metadata: {
          created: Date.now(),
          modified: Date.now(),
          createdBy: "user_1" as UUID
        },
        uiType: "button",
        events: []
      }
    ],
    connections: [],
    variables: [],
    selected: { nodeIds: [], connectionIds: [] },
    viewport: { zoom: 1, offset: { x: 0, y: 0 } },
    settings: { snapToGrid: true, gridSize: 20 }
  }

  // Assemble the overall editor state
  const editorState: EditorState = {
    currentView: 'design',
    designView,
    flowView,
    componentLibrary: { components: [], categories: [], tags: [] },
    designSystems: [],
    assets: { assets: [], categories: [], tags: [] },
    variables: { variables: [], scopes: [], types: [] },
    dataSources: { sources: [], types: [] },
    content: { models: [], entries: [] },
    i18n: { languages: [], bundles: [] },
    history: {
      undoStack: [],
      redoStack: [],
      current: {
        id: "hist_1" as UUID,
        type: 'design',
        timestamp: Date.now(),
        description: "Initial state",
        snapshot: {
          design: designView,
          flow: flowView,
          data: { variables: [], dataSources: [], content: [], i18n: [], apiEndpoints: [] }
        }
      }
    },
    settings: {
      theme: 'light',
      defaultView: 'design',
      componentLibraryView: 'grid',
      autoSave: true,
      autoSaveInterval: 3000,
      keyboardShortcuts: [],
      experimentalFeatures: {
        aiAssist: false,
        realTimeCollaboration: false,
        versionControlIntegration: false,
        advancedAnimations: false
      },
      versionControl: {
        enabled: true,
        autoCommit: true,
        branch: 'main'
      },
      build: {
        mode: "development",
        outputDir: "dist",
        cleanBeforeBuild: true
      },
      deployment: {
        defaultEnvironment: "development",
        autoDeploy: false
      }
    },
    collaboration: {
      users: [],
      session: { id: "sess_1" as UUID, started: Date.now(), active: true },
      comments: [],
      changes: []
    },
    plugins: { plugins: [], enabled: [] },
    ai: { enabled: false, providers: [], history: [] },
    deployment: {
      environments: [],
      history: [],
      artifacts: []
    },
    ui: {
      panels: [],
      tools: [],
      inspectors: [],
      modals: [],
      toasts: [],
      preferences: {
        theme: 'light',
        layout: 'default',
        iconSize: 'medium',
        density: 'normal',
        animations: true,
        transitions: true
      }
    },
  }

  // Create a snapshot for the initial version
  const snapshot: EditorSnapshot = {
    design: designView,
    flow: flowView,
    data: {
      variables: [],
      dataSources: [],
      content: [],
      i18n: [],
      apiEndpoints: []
    }
  }

  // Build the initial editor object using the new types
  const initialEditor: Editor = {
    id: editor.id as UUID,
    meta: {
      name: editor?.name,
      slug: params.editorSlug,
      description: editor?.description ?? "",
      icon: "asset_icon_123" as AssetID,
      tags: ["design", "flow", "prototype"],
      isTemplate: false,
      templateId: undefined
    },
    state: editorState,
    versions: [
      {
        id: "version_1" as UUID,
        name: "Initial Version",
        description: "First version of the editor",
        snapshot,
        createdBy: "user_1" as UUID,
        createdAt: Date.now()
      }
    ],
    collaborators: [
      {
        userId: "user_1" as UUID,
        role: 'admin',
        joinedAt: Date.now(),
        permissions: ["edit", "deploy", "share", "export"]
      }
    ],
    settings: {
      theme: 'light',
      defaultView: 'design',
      componentLibraryView: 'grid',
      autoSave: true,
      autoSaveInterval: 3000,
      keyboardShortcuts: [],
      experimentalFeatures: {
        aiAssist: false,
        realTimeCollaboration: false,
        versionControlIntegration: false,
        advancedAnimations: false
      },
      versionControl: {
        enabled: true,
        autoCommit: true,
        branch: "main"
      },
      build: {
        mode: "development",
        outputDir: "dist",
        cleanBeforeBuild: true
      },
      deployment: {
        defaultEnvironment: "development",
        autoDeploy: false
      }
    },
    environments: [
      {
        id: "env_dev" as UUID,
        name: "Development",
        type: "development",
        config: {
          apiBaseUrl: "https://dev.api.example.com",
          chainId: 1337,
          contractAddresses: {
            main: "0x1234567890abcdef"
          }
        }
      }
    ],
    createdAt: Date.now(),
    updatedAt: Date.now()
  }

  if (!initialEditor) {
    return (
      <div className='flex items-center justify-center h-screen w-screen z-[5000]'>
        <Dialog open>
          <DialogContent
            className="sm:max-w-[500px] bg-white/90 dark:border-zinc-800 dark:bg-zinc-900/90 backdrop-blur-sm"
          >
            <DialogHeader>
              <DialogTitle className="text-xl text-zinc-100">Error</DialogTitle>
              <p className="text-sm text-zinc-400">
                Your editor has not launched properly. Refresh to try again.
              </p>
            </DialogHeader>
            <Button className="w-full" onClick={()=>revalidatePath(`/${params.workspaceSlug}/${params.projectSlug}/editors/${params.editorSlug}`)}>
              <RefreshCcw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <EditorProvider initialEditor={initialEditor} currentUser={session?.user}>
      <ClientPage params={params} />
    </EditorProvider>
  )
}

export default Page