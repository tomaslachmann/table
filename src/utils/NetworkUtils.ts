import NetworkError from '../errors/NetworkError';

/**
 * Converts {@link TypeError} coming from fetch call to {@link NetworkError}, leaves other errors untouched.
 *
 * @param {Error} e Error from fetch call
 * @returns Error
 */
export function convertFetchError(e: TypeError) {
  if (e instanceof TypeError) {
    return new NetworkError(e.message);
  } else {
    return e;
  }
}
