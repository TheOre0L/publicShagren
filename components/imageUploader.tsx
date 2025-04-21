import React from 'react';
import { $api, API_URL } from '@/http/requests';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

const ImagesUploading = ({ image, setImages, type }) => {
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        setImages((prevImages) => {
            const updatedImages = Array.from(prevImages);
            const [movedImage] = updatedImages.splice(result.source.index, 1);
            updatedImages.splice(result.destination.index, 0, movedImage);
            return updatedImages;
        });
    };

    const handleDeleteImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const openFileDialog = () => {
        document.getElementById("file-upload")?.click();
    };

    const handleChangeFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files) return;

            const files = Array.from(event.target.files);
            const uploadedImages = await Promise.all(files.map(async (file) => {
                const formData = new FormData();
                const uniqueFile = new File([file], `${type}_${crypto.randomUUID()}`, { type: file.type });
                formData.append("file", uniqueFile);

                const { data } = await $api.post("/upload", formData);
                return {
                    id: crypto.randomUUID(),
                    alt: `Картинка: ${data.filePath}`,
                    file: `${data.filePath}`,
                };
            }));

            setImages((prevImages) => [...prevImages, ...uploadedImages]);
        } catch (e) {
            console.error("Ошибка загрузки файла:", e);
        }
    };

    return (
        <div>
            {/* Скрытый input */}
            <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleChangeFile}
            />

            {/* Кнопка выбора файлов */}
            <Button variant="outline" size="sm" onClick={openFileDialog}>
                <Upload className="mr-2 h-4 w-4" /> Выбрать файлы
            </Button>

            <DragDropContext onDragEnd={handleDragEnd}>
                {image.length > 0 && (
                    <Droppable isDropDisabled={false} isCombineEnabled={true} ignoreContainerClipping={false} droppableId="thumbnails" direction="horizontal">
                        {(provided) => (
                            <div
                                className="flex flex-wrap"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {image.map((img, index) => (
                                    <Draggable key={img.id} draggableId={String(img.id)} index={index}>
                                        {(provided) => (
                                            <div
                                                className="relative m-2"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <img
                                                    className="w-20 h-20 object-cover rounded"
                                                    src={`${API_URL}/uploads/${img.file}`}
                                                    alt={img.alt}
                                                />
                                                <button
                                                    onClick={() => handleDeleteImage(index)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                )}
            </DragDropContext>
        </div>
    );
};

export default ImagesUploading;
