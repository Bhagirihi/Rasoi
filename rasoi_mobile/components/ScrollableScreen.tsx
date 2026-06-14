import type { ReactElement, Ref } from 'react';
import { FlatList, ScrollView, StyleSheet, View, type FlatListProps, type ScrollViewProps } from 'react-native';

import FloatingScrollIndicator from '@/components/FloatingScrollIndicator';
import { scrollIndicator } from '@/constants/theme';
import { useFloatingScrollIndicator } from '@/hooks/useFloatingScrollIndicator';

type FlatListWithFloatingProps<T> = FlatListProps<T> & {
  floatingBottomOffset?: number;
  floatingLabel?: string;
  showFloatingIndicator?: boolean;
  listRef?: Ref<FlatList<T>>;
};

export function FlatListWithFloatingIndicator<T>({
  floatingBottomOffset = 0,
  floatingLabel,
  showFloatingIndicator = true,
  listRef,
  onScroll,
  onContentSizeChange,
  onLayout,
  style,
  ...rest
}: FlatListWithFloatingProps<T>): ReactElement {
  const floating = useFloatingScrollIndicator();

  return (
    <View style={[styles.container, style]}>
      <FlatList
        ref={listRef}
        {...scrollIndicator}
        {...rest}
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={floating.scrollEventThrottle}
        onLayout={(event) => {
          floating.onLayout(event);
          onLayout?.(event);
        }}
        onContentSizeChange={(width, height) => {
          floating.onContentSizeChange(width, height);
          onContentSizeChange?.(width, height);
        }}
        onScroll={(event) => {
          floating.onScroll(event);
          onScroll?.(event);
        }}
      />
      <FloatingScrollIndicator
        visible={showFloatingIndicator && floating.visible}
        bottomOffset={floatingBottomOffset}
        label={floatingLabel}
      />
    </View>
  );
}

type ScrollViewWithFloatingProps = ScrollViewProps & {
  floatingBottomOffset?: number;
  floatingLabel?: string;
};

export function ScrollViewWithFloatingIndicator({
  floatingBottomOffset = 0,
  floatingLabel,
  children,
  horizontal,
  onScroll,
  onContentSizeChange,
  onLayout,
  style,
  contentContainerStyle,
  ...rest
}: ScrollViewWithFloatingProps): ReactElement {
  const floating = useFloatingScrollIndicator();

  if (horizontal) {
    return (
      <ScrollView
        horizontal
        {...scrollIndicator}
        {...rest}
        style={style}
        contentContainerStyle={contentContainerStyle}
        onScroll={onScroll}
        onContentSizeChange={onContentSizeChange}
        onLayout={onLayout}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        {...scrollIndicator}
        {...rest}
        style={styles.flex}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={floating.scrollEventThrottle}
        onLayout={(event) => {
          floating.onLayout(event);
          onLayout?.(event);
        }}
        onContentSizeChange={(width, height) => {
          floating.onContentSizeChange(width, height);
          onContentSizeChange?.(width, height);
        }}
        onScroll={(event) => {
          floating.onScroll(event);
          onScroll?.(event);
        }}
      >
        {children}
      </ScrollView>
      <FloatingScrollIndicator
        visible={floating.visible}
        bottomOffset={floatingBottomOffset}
        label={floatingLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
});
