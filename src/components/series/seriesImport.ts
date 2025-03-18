import { useEventStore } from '../../store/eventStore';

export const handleFileUpload = async (
  e: React.ChangeEvent<HTMLInputElement>,
  fileInputRef: React.RefObject<HTMLInputElement>
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);

    if (!data.category || !data.events || !Array.isArray(data.events)) {
      throw new Error('Format JSON invalide');
    }

    const { addCategory, addEvent } = useEventStore.getState();

    // Add category
    const categoryId = addCategory({
      name: data.category.name,
      description: data.category.description || '',
      colors: data.category.colors || { default: '#000000' },
      positions: data.category.positions || { default: 1 }
    });

    // Add events with default value if not specified
    data.events.forEach((event: any) => {
      addEvent({
        name: event.name,
        startDate: event.startDate,
        endDate: event.endDate,
        color: event.color || data.category.colors.default,
        visible: event.visible !== undefined ? event.visible : true,
        position: event.position || 1,
        category: categoryId,
        type: event.type || '',
        value: typeof event.value === 'number' ? parseFloat(event.value.toFixed(2)) : 0.00
      });
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
    alert('Erreur lors de l\'import du fichier. Vérifiez le format JSON.');
  }
};