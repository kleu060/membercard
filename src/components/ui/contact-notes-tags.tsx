'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Save, 
  X, 
  Plus, 
  Tag, 
  FileText, 
  Edit3,
  Check
} from 'lucide-react';

interface ContactTag {
  id: string;
  tag: string;
  color: string;
  createdAt: string;
}

interface ContactNotesTagsProps {
  cardId: string;
  userId: string;
  initialNotes?: string;
  initialTags?: ContactTag[];
  isProUser?: boolean;
  onUpdate?: () => void;
}

export default function ContactNotesTags({
  cardId,
  userId,
  initialNotes = '',
  initialTags = [],
  isProUser = false,
  onUpdate
}: ContactNotesTagsProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [tags, setTags] = useState<ContactTag[]>(initialTags);
  const [newTag, setNewTag] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const colorOptions = [
    { name: 'Blue', value: '3B82F6' },
    { name: 'Green', value: '10B981' },
    { name: 'Red', value: 'EF4444' },
    { name: 'Yellow', value: 'F59E0B' },
    { name: 'Purple', value: '8B5CF6' },
    { name: 'Pink', value: 'EC4899' },
    { name: 'Indigo', value: '6366F1' },
    { name: 'Gray', value: '6B7280' }
  ];

  useEffect(() => {
    setNotes(initialNotes);
    setTags(initialTags);
  }, [initialNotes, initialTags]);

  const handleSaveNotes = async () => {
    if (!isProUser) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/saved-cards/${cardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          notes
        }),
      });

      if (response.ok) {
        setIsEditingNotes(false);
        onUpdate?.();
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = async () => {
    if (!isProUser || !newTag.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/saved-cards/${cardId}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          tag: newTag.trim(),
          color: colorOptions[0].value
        }),
      });

      if (response.ok) {
        const newTagData = await response.json();
        setTags([...tags, newTagData]);
        setNewTag('');
        onUpdate?.();
      }
    } catch (error) {
      console.error('Error adding tag:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!isProUser) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/saved-cards/${cardId}/tags/${tagId}?userId=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTags(tags.filter(tag => tag.id !== tagId));
        onUpdate?.();
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTagStyle = (color: string) => {
    return {
      backgroundColor: `#${color}20`,
      color: `#${color}`,
      borderColor: `#${color}40`
    };
  };

  if (!isProUser) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Professional Feature
            </h3>
            <p className="text-gray-600 mb-4">
              Upgrade to Professional plan to add notes and tags to your contacts
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Notes Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Notes
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingNotes(!isEditingNotes)}
            >
              {isEditingNotes ? (
                <X className="w-4 h-4" />
              ) : (
                <Edit3 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditingNotes ? (
            <div className="space-y-3">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this contact..."
                className="min-h-[100px]"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveNotes}
                  disabled={isLoading}
                  size="sm"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditingNotes(false)}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="min-h-[60px]">
              {notes ? (
                <p className="text-gray-700 whitespace-pre-wrap">{notes}</p>
              ) : (
                <p className="text-gray-500 italic">No notes added yet. Click the edit button to add notes.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tags Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tags
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingTags(!isEditingTags)}
            >
              {isEditingTags ? (
                <X className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditingTags ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddTag}
                  disabled={isLoading || !newTag.trim()}
                  size="sm"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              {/* Color Options */}
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-gray-400"
                    style={{ backgroundColor: `#${color.value}` }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {/* Tags Display */}
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                  style={getTagStyle(tag.color)}
                >
                  <span>{tag.tag}</span>
                  {isEditingTags && (
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))
            ) : (
              <p className="text-gray-500 italic">
                {isEditingTags ? 'Add tags to categorize this contact.' : 'No tags added yet.'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}