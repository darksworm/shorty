from itertools import chain


class Hydra(object):
    alphabet_ord = chain(range(97, 123), range(65, 91), range(48, 58))
    alphabet = [chr(o) for o in alphabet_ord]
    base = len(alphabet)

    @staticmethod
    def __convert_base(b10: int) -> [int]:
        digits = []
        while b10:
            digits.append(int(b10 % Hydra.base))
            b10 /= Hydra.base
        return digits[::-1]

    @staticmethod
    def __revert_base(bx: [int]) -> int:
        result = 0
        length = len(bx)
        for i, val in enumerate(bx):
            result += val * (Hydra.base ** (length - (i + 1)))

        return result

    @staticmethod
    def dehydrate(b10: int) -> str:
        new_base = Hydra.__convert_base(b10)

        i = None
        # find first non-zero number in array
        for i, val in enumerate(new_base):
            if val != 0:
                break

        if i is None:
            raise ValueError()

        result = ''
        for val in new_base[i:]:
            result += Hydra.alphabet[val]

        return result

    @staticmethod
    def hydrate(key: str) -> int:
        new_base = []
        for val in key:
            new_base.append(Hydra.alphabet.index(val))

        return Hydra.__revert_base(new_base)
