import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const forms = await db.leadForm.findMany({
      include: {
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ forms });
  } catch (error) {
    console.error('Error fetching lead forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead forms' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, isActive, isPublic, fields, userId } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Generate embed code
    const embedCode = generateEmbedCode(name, fields || []);

    // Create form
    const form = await db.leadForm.create({
      data: {
        name,
        description: description || null,
        isActive: isActive !== undefined ? isActive : true,
        isPublic: isPublic !== undefined ? isPublic : true,
        embedCode,
        fields: fields || [],
        userId
      }
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error('Error creating lead form:', error);
    return NextResponse.json(
      { error: 'Failed to create lead form' },
      { status: 500 }
    );
  }
}

function generateEmbedCode(formName: string, fields: any[]): string {
  const fieldInputs = fields.map((field: any) => {
    const required = field.required ? 'required' : '';
    const placeholder = field.placeholder ? `placeholder="${field.placeholder}"` : '';
    
    switch (field.type) {
      case 'textarea':
        return `<textarea name="${field.name}" ${placeholder} ${required} rows="4" class="w-full p-2 border rounded"></textarea>`;
      case 'select':
        const options = field.options?.map((opt: string) => `<option value="${opt}">${opt}</option>`).join('') || '';
        return `<select name="${field.name}" ${required} class="w-full p-2 border rounded">
          <option value="">Select ${field.label}</option>
          ${options}
        </select>`;
      default:
        return `<input type="${field.type}" name="${field.name}" ${placeholder} ${required} class="w-full p-2 border rounded">`;
    }
  }).join('\n      ');

  return `
<!-- ${formName} Embed Code -->
<form id="${formName.toLowerCase().replace(/\s+/g, '-')}-form" class="space-y-4">
  ${fieldInputs}
  <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
    Submit
  </button>
</form>

<script>
document.getElementById('${formName.toLowerCase().replace(/\s+/g, '-')}-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = new FormData(this);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await fetch('/api/lead-forms/public/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formName: '${formName}',
        data: data
      })
    });
    
    if (response.ok) {
      alert('Form submitted successfully!');
      this.reset();
    } else {
      alert('Error submitting form. Please try again.');
    }
  } catch (error) {
    alert('Error submitting form. Please try again.');
  }
});
</script>
  `.trim();
}