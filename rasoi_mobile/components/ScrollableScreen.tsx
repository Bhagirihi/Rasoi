import type { ReactElement, Ref } from 'react';
import { FlatList, ScrollView, StyleSheet, type FlatListProps, type ScrollViewProps } from 'react-native';

import { scrollIndicator } from '@/constants/theme';

type FlatListScreenProps<T> = FlatListProps<T> & {
  listRef?: Ref<FlatList<T>>;
};

export function FlatListWithFloatingIndicator<T>({
  listRef,
  style,
  ...rest
}: FlatListScreenProps<T>): ReactElement {
  return (
    <FlatList
      ref={listRef}
      {...scrollIndicator}
      {...rest}
      style={[styles.flex, style]}
      showsVerticalScrollIndicator={false}
    />
  );
}

type ScrollViewScreenProps = ScrollViewProps;

export function ScrollViewWithFloatingIndicator({
  children,
  horizontal,
  style,
  contentContainerStyle,
  ...rest
}: ScrollViewScreenProps): ReactElement {
  return (
    <ScrollView
      horizontal={horizontal}
      {...scrollIndicator}
      {...rest}
      style={style}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={!horizontal}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
