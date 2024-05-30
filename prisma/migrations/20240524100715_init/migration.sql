-- CreateTable
CREATE TABLE "Movie" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "originalTitle" TEXT,
    "overview" TEXT,
    "posterUrl" TEXT,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "genreIds" INTEGER[],
    "voteAverage" DECIMAL(65,30),
    "rawData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Query" (
    "id" TEXT NOT NULL,
    "search" TEXT NOT NULL,
    "page" INTEGER NOT NULL,
    "pageCount" INTEGER,
    "resultCount" INTEGER,
    "hitCount" INTEGER NOT NULL DEFAULT 0,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Query_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueriesOnMovies" (
    "movieId" INTEGER NOT NULL,
    "queryId" TEXT NOT NULL,

    CONSTRAINT "QueriesOnMovies_pkey" PRIMARY KEY ("movieId","queryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie_id_key" ON "Movie"("id");

-- AddForeignKey
ALTER TABLE "QueriesOnMovies" ADD CONSTRAINT "QueriesOnMovies_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueriesOnMovies" ADD CONSTRAINT "QueriesOnMovies_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "Query"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
