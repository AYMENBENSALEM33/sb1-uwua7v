import { useEventStore } from '../../../store/eventStore';
import { LoggerService } from '../../../services/api/logger';

const logger = new LoggerService();

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
      throw new Error('Invalid JSON format');
    }

    const { addCategory, addEvent } = useEventStore.getState();

    // Add category
    const categoryId = await addCategory({
      name: data.category.name,
      description: data.category.description || '',
      colors: data.category.colors || { default: '#000000' },
      positions: data.category.positions || { default: 1 }
    });

    // Add events
    for (const event of data.events) {
      await addEvent({
        name: event.name,
        startDate: event.startDate,
        endDate: event.endDate,
        color: event.color || data.category.colors.default,
        visible: event.visible !== undefined ? event.visible : true,
        position: event.position || 1,
        seriesId: categoryId,
        type: event.type || '',
        value: typeof event.value === 'number' ? parseFloat(event.value.toFixed(2)) : 0.00
      });
    }

    logger.success('File imported successfully');

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Import error: ' + message);
    alert('Error importing file. Check JSON format.');
  }
};