export default function StarRating({ rating, onRate, size = "md" }) {
  const sz = size === "lg" ? "text-2xl" : "text-base";
  return (
    <div className={`flex gap-0.5 ${sz}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate && onRate(star)}
          className={`${onRate ? "cursor-pointer hover:scale-110" : "cursor-default"} transition ${
            star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
