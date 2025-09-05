import { useState, useEffect } from "react";

export const useImageLazyLoad = (imageUrl, isVisible) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isVisible) {
      setIsLoading(true);
      const img = new Image();
      img.onload = () => {
        setIsLoading(false);
      }
      img.src = imageUrl;
    }
  }, [isVisible, imageUrl]);

  return { isLoading };

}