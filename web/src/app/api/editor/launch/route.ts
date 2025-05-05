// app/api/editor/launch/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '../../auth/[...nextauth]/auth-options';

export async function POST(req: Request) {
  try {
    const session = await auth()
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate the workspace belongs to the user
    const project = await prisma.project.findFirst({
      where: {
        slug: body.projectSlug,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
    }

    // Create the project
    const editor = await prisma.editor.create({
      data: {
        projectId: project.id,
        name: body.name,
        slug: body.slug,
        description: body.description,
      },
    });

    return NextResponse.json(editor);
  } catch (error) {
    console.error('Error launching editor:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}