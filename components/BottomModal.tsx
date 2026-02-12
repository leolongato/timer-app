import { BaseColor } from "@/theme/colors";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { PropsWithChildren, useCallback, useEffect, useRef } from "react";
import { useColorScheme } from "react-native";

type Props = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
}>;

export default function BottomModal({ visible, onClose, children }: Props) {
  const colorScheme = useColorScheme();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      backdropComponent={renderBackdrop}
      enableDynamicSizing
      enablePanDownToClose
      enableContentPanningGesture={false}
      onDismiss={onClose}
      backgroundStyle={{
        backgroundColor:
          colorScheme === "dark" ? BaseColor[900] : BaseColor[50],
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}
      handleIndicatorStyle={{
        backgroundColor:
          colorScheme === "dark" ? BaseColor[100] : BaseColor[500],
        width: 48,
        marginTop: 12,
      }}
    >
      <BottomSheetView
        style={{
          paddingHorizontal: 24,
          paddingTop: 8,
          paddingBottom: 32,
        }}
      >
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
}
