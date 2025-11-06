import React, {
    useState, useEffect, useCallback, useMemo,
} from "react";

export function UploadFile() {
    const [ dragActive, setDragActive ] = useState(false);
    const [ file, setFile ] = useState<File | null>(null);
    const [ uploading, setUploading ] = useState(false);
    const [ progress, setProgress ] = useState<number>(0);
    const [ error, setError ] = useState<string | null>(null);

    const allowedTypes = useMemo(() => [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
        "image/bmp",
    ], []);

    const handleFile = useCallback((file: File) => {
        if (!allowedTypes.includes(file.type)) {
            setError("Неверный тип файла. Допустимы: png, jpeg, webp, gif, svg+xml, bmp");

            return;
        }
        setFile(file);
        setError(null);
        setProgress(0);
    }, [ allowedTypes ]);

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
                const pastedFile = e.clipboardData.files[0];
                handleFile(pastedFile);
            }
        };

        document.addEventListener("paste", handlePaste);

        return () => document.removeEventListener("paste", handlePaste);
    }, [ handleFile ]);

    const handleUpload = async() => {
        console.log("Upload file uploaded");
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleReset = () => {
        setFile(null);
        setProgress(0);
        setError(null);
        setUploading(false);
    };

    return (
        <>
            <span className="title">Загрузка чека</span>
            <span className="addition_3 mb-20">
                Загрузите фото, проверьте распознавание и сохраните операцию
            </span>
            <div
                className={ `upload-dropzone ${dragActive ? "active" : ""}` }
                onDragEnter={ handleDrag }
                onDragOver={ handleDrag }
                onDragLeave={ handleDrag }
                onDrop={ handleDrop }
            >
                {file ? (
                    <div className="file-info">
                        <span className="addition_2">
                            Выбран файл: <strong>{file.name}</strong>
                        </span>

                        <div className="actions">
                            {!uploading ? (
                                <>
                                    <button
                                        onClick={ handleUpload }
                                        className="control_btn accept"
                                    >
                                        Отправить
                                    </button>
                                    <button
                                        onClick={ handleReset }
                                        className="control_btn cancel"
                                    >
                                        Сбросить
                                    </button>
                                </>
                            ) : (
                                <p>Загрузка... {progress}%</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <svg className="icon upload">
                            <use href="#UploadingReceipts" />
                        </svg>
                        <span className="addition_1">
                            Перетащите сюда изображение или нажмите для выбора
                        </span>
                        <span className="addition_3">
                            Поддерживаются фото и скриншоты
                        </span>

                        <label className="Button uploadReceipt w-a">
                            Загрузить
                            <input
                                type="file"
                                accept=".jpg, .jpeg, .png, .gif, .webp, .svg, .bmp"
                                onChange={ handleChange }
                                hidden
                            />
                        </label>
                    </>
                )}
                {error && <p className="error">{error}</p>}
            </div>
        </>
    );
}
